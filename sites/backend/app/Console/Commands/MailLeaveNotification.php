<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Schedule;
use App\Models\Manager;
use Mail;
use App\Mail\EmailForLeaveReminder;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class MailLeaveNotification extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notify:sendDailyLeaves';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send email of daily leaves.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
      $managers = Manager::get();

      foreach ($managers as $m) {
        $schedules = Schedule::with('user')->whereDate('start_time', '<=', Carbon::today()->toDateString())
        ->whereDate('end_time', '>=', Carbon::today()->toDateString())
        ->whereHas('user', function ($query) use ($m) {
          $query->where('manager_id','=',$m->id);
        })->get();

        // Log::info(print_r($schedules, true));
        if (count($schedules)) {
          $result = $this->textResult($schedules);
          Log::info("Send to ". $m->email);
          Log::info($result);
          // Mail::to($m->email)->send(new EmailForLeaveReminder($schedules));
        }
      }
    }

    private function textResult($schedules){
      if (count($schedules)) {
        $result = "Leave for " . Carbon::today()->toDateString() . " \n\n"; //" 
        $result .= "Name     |     Date          |      Reason \n\n";
        foreach($schedules as $s) {
          $result .= $s->user_name . " | ";
          if (count($s->day_type_leaves)) {
            foreach($s->day_type_leaves as $d) {
              $result .= $d->format_date . " (" . $d->day_type_leave . "), ";
            }
          } else {
            $result .= $s->format_date . " (" . $s->leave_type . ")";
          }
          $result .= "|" . $s->description . " \n\n";
        }
        return $result;
      }
    }
}
