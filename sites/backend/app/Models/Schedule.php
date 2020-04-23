<?php

namespace App\Models;

use App\Http\Resources\ScheduleResource;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Carbon\Carbon;


class Schedule extends Model
{
    const TABLE_NAME = 'schedules';
    protected $perPage = 50;
    use Notifiable;

    protected $fillable = [
        'title',
        'user_id',
        'location',
        'description',
        'start_time',
        'end_time',
        'classification',
        'leave_type',
        'day_type_leave',
    ];

    protected $table = self::TABLE_NAME;

    public $resource = ScheduleResource::class;

    public function day_type_leaves()
    {
        return $this->hasMany('App\Models\ScheduleDetail');
    }

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function getUserNameAttribute()
    {
        return $this->user->first_name . " " . $this->user->last_name;
    }

    public function getFormatDateAttribute()
    {
        return Carbon::parse($this->start_time)->format('M. j, Y');
    }

}
