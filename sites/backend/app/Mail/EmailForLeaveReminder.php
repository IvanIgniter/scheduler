<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Notifications\Messages\MailMessage;

class EmailForLeaveReminder extends Mailable
{
    use Queueable, SerializesModels;
    protected $schedules;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($schedules)
    {
        $this->schedules = $schedules;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('mail.scheduled-leave-per-day',
        [
          'schedules' => $this->schedules,
        ]);
    }
}
