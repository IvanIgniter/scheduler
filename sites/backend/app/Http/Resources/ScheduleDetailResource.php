<?php

namespace App\Http\Resources;

use Carbon\Carbon;

class ScheduleDetailResource extends Resource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'schedule_id' => $this->schedule_id,
            'date' => $this->date,
            'format_date' => $this->format_date,
            'day_type_leave' => $this->day_type_leave,
        ];
    }
}
