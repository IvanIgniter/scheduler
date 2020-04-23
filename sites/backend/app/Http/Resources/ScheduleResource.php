<?php

namespace App\Http\Resources;
use App\Http\Resources\ScheduleDetailResource;
use App\Http\Resources\UserResource;


class ScheduleResource extends Resource
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
            'user_id' => $this->user_id,
            'user_name' => $this->user_name,
            'title' => $this->title,
            'location' => $this->location,
            'description' => $this->description,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'classification' => $this->classification,
            'leave_type' => $this->leave_type,
            'day_type_leaves' => $this->day_type_leaves ? ScheduleDetailResource::collection($this->day_type_leaves) : [],
            // 'user' => $this->user ? UserResource::collection($this->user) : [],
        ];
    }
}
