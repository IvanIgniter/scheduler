<?php

namespace App\Models;

use App\Http\Resources\ScheduleDetailResource;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class ScheduleDetail extends Model
{
    const TABLE_NAME = 'schedule_details';

    protected $fillable = [
        'schedule_id',
        'date',
        'day_type_leave',
    ];

    protected $table = self::TABLE_NAME;

    public $resource = ScheduleDetailResource::class;

    public function schedule()
    {
        return $this->belongsTo('App\Models\Schedule');
    }

    public function getFormatDateAttribute()
    {
        return Carbon::parse($this->date)->format('M. j, Y');
    }
}
