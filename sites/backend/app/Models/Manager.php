<?php

namespace App\Models;

use App\Http\Resources\ManagerResource;
use Illuminate\Database\Eloquent\Model;

class Manager extends Model
{
    const TABLE_NAME = 'managers';

    protected $fillable = [
        'name',
        'email',
    ];

    protected $table = self::TABLE_NAME;

    public $resource = ManagerResource::class;

}
