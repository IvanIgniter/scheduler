<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Api\Controller;
use App\Http\Requests\ScheduleRequest;
use App\Services\ScheduleService;
use App\Http\Resources\JsonResponse;
use Notification;
use App\Notifications\ScheduleNotification;
use Illuminate\Notifications\Notifiable;
use App\Models\User;
use Carbon\Carbon;

class ScheduleController extends Controller
{
    protected $scheduleService;

    public function __construct(ScheduleService $scheduleService)
    {
        $this->scheduleService = $scheduleService;
    }

    public function index()
    {
        return $this->showAllWithoutPaginate($this->scheduleService->getSchedules());
    }

    public function store(Request $request)
    { 
        $payload = $request->all();
        // dd($payload);
        $result = $this->scheduleService->createSchedule($payload['schedule']);

        if ($result) {
          $user = User::with('manager')->where('id',2)->first();
          $title = $payload['schedule']['title'];
          $message = $payload['schedule']['description'];
          // $day_type_leave = $payload['schedule']['day_type_leave'];
          $schedule = ['from' => Carbon::parse($payload['schedule']['start_time'])->format('M. d, Y'),
                       'to' => Carbon::parse($payload['schedule']['end_time'])->format('M. d, Y')];
          // dd($payload);
          Notification::route('mail', $user->manager->email)->notify(
              new ScheduleNotification(
                $user,
                $title,
                $message,
                $schedule,
                ''
              )
          );

          return response()->json(['status' => 'success', 'message' => 'Successfully saved']);
        }
    }


    public function update(Request $request, $id)
    {
        $payload = $request->all();
        // dd($payload);
        $result = $this->scheduleService->updateSchedule($payload['schedule'], $id);

        if ($result) {
          $user = User::with('manager')->where('id',2)->first();
          $title = $payload['schedule']['title'];
          $message = $payload['schedule']['description'];
          // $day_type_leave = $payload['schedule']['day_type_leave'];
          $schedule = ['from' => Carbon::parse($payload['schedule']['start_time'])->format('M. d, Y'),
                       'to' => Carbon::parse($payload['schedule']['end_time'])->format('M. d, Y')];
          // dd($payload);
          Notification::route('mail', $user->manager->email)->notify(
            new ScheduleNotification(
              $user,
              $title,
              $message,
              $schedule,
              ''
            )
          );

          return response()->json(['status' => 'success', 'message' => 'Successfully updated']);
        }

    }

    public function destroy(Request $request, $id)
    {
        $result = $this->scheduleService->deleteSchedule($id);
        return response()->json(['status' => 'success', 'message' => 'Successfully deleted']);
    }

}
