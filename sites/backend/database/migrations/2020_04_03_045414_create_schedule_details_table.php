<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateScheduleDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('schedule_details', function (Blueprint $table) {
          $table->increments('id');
          $table->integer('schedule_id')->unsigned()->index('index_detail__schedule_id');
          $table->dateTime('date');
          $table->enum('day_type_leave', ['Whole Day','AM','PM'])->nullable();
          $table->timestamps();

          $table->foreign('schedule_id', 'fk_schedule__details')
          ->references('id')
          ->on('schedules')
          ->onUpdate('NO ACTION')
          ->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('schedule_details');
    }
}
