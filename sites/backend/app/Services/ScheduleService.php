<?php

namespace App\Services;

use App\Models\Schedule;
use App\Models\ScheduleDetail;

class ScheduleService
{
    public function getSchedules()
    {
        return Schedule::where('user_id', '=', 1)->get();
    }

    public function getSchedule($id)
    {
        return Schedule::findOrFail($id);
    }

    public function createSchedule($data)
    {
      // dd($data);
        $schedule = Schedule::create([
          'user_id' => $data['user_id'],
          'title' => $data['title'],
          'location' => $data['location'] ? $data['location'] : '',
          'description' => $data['description'] ? $data['description'] : '',
          'start_time' => $data['start_time'] ? $data['start_time'] : '',
          'end_time' => $data['end_time'] ? $data['end_time'] : '',
          'classification' => $data['classification'] ? $data['classification'] : '',
          'leave_type' => $data['leave_type'] ? $data['leave_type'] : '',
          // 'day_type_leave' => $data['day_type_leave'] ? $data['day_type_leave'] : '',
        ]);

        if ($schedule && $data['day_type_leaves']) {
          $day_type_leaves = json_decode($data['day_type_leaves']);
          foreach ($day_type_leaves as $value) {
            ScheduleDetail::create([
              'schedule_id' => $schedule->id,
              'date' => $value->date,
              'day_type_leave' => $value->day_type_leave,
            ]);
          }
        }

        return true;

    }

    public function updateSchedule($data, $id)
    {
        $schedule = Schedule::findOrFail($id);
        // dd($data);
        $schedule->user_id = $data['user_id'];
        $schedule->title = $data['title'];
        $schedule->location = $data['location'] ? $data['location'] : '';
        $schedule->description = $data['description'] ? $data['description'] : '';
        $schedule->start_time = $data['start_time'] ? $data['start_time'] : '';
        $schedule->end_time = $data['end_time'] ? $data['end_time'] : '';
        $schedule->classification = $data['classification'] ? $data['classification'] : '';
        $schedule->leave_type = $data['leave_type'] ? $data['leave_type'] : '';
        $schedule->save();

        if ($schedule && $data['day_type_leaves']) {
          $day_type_leaves = json_decode($data['day_type_leaves']);
          ScheduleDetail::where('schedule_id', $id)->delete();

          foreach ($day_type_leaves as $value) {
            ScheduleDetail::create([
              'schedule_id' => $schedule->id,
              'date' => $value->date,
              'day_type_leave' => $value->day_type_leave,
            ]);
          }
        }

      return true;
    }

    public function deleteSchedule($id)
    {
      ScheduleDetail::where('schedule_id', $id)->delete();
      Schedule::where('id', $id)->delete();
      return true;
    }

}
