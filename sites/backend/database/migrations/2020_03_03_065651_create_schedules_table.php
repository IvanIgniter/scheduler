<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSchedulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->increments('id');
            $table->bigInteger('user_id')->unsigned()->index('index_schedules__user_id');
            $table->string('title');
            $table->string('location')->nullable();
            $table->string('description')->nullable();
            $table->timestamp('start_time')->nullable();
            $table->timestamp('end_time')->nullable();
            $table->enum('classification', ['Planned','Unplanned'])->nullable();
            $table->enum('leave_type', ['Sick','Vacation'])->nullable();
            $table->timestamps();
            $table->foreign('user_id', 'fk_schedules__user_id')
                ->references('id')
                ->on('users')
                ->onUpdate('NO ACTION')
                ->onDelete('CASCADE');
        });
    }

    public function down()
    {
        Schema::dropIfExists('schedules');
    }
}
