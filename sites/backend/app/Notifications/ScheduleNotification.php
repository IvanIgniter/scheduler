<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ScheduleNotification extends Notification
{
  use Queueable;

  protected $user;
  protected $title;
  protected $message;
  protected $schedule;
  protected $day_type_leave;

  /**
   * Create a new notification instance.
   *
   * @return void
   */
  public function __construct($user, $title, $message, $schedule, $day_type_leave)
  {
      $this->user = $user;
      $this->title = $title;
      $this->message = $message;
      $this->schedule = $schedule;
      $this->day_type_leave = $day_type_leave;
  }

  /**
   * Get the notification's delivery channels.
   *
   * @param  mixed  $notifiable
   * @return array
   */
  public function via($notifiable)
  {
      return ['mail'];
  }

  /**
   * Get the mail representation of the notification.
   *
   * @param  mixed  $notifiable
   * @return \Illuminate\Notifications\Messages\MailMessage
   */
  public function toMail($notifiable)
  {
      return (new MailMessage)
          ->subject('Schedule')
          ->from('hr@sprobe.com', 'HR')
          ->markdown('mail.schedule-notification', [
              'last_name' => $this->user->last_name,
              'first_name' => $this->user->first_name,
              'title' => $this->title,
              'message' => $this->message,
              'schedule' => $this->schedule,
              'day_type_leave' => $this->day_type_leave
          ]);
  }

  /**
   * Get the array representation of the notification.
   *
   * @param  mixed  $notifiable
   * @return array
   */
  public function toArray($notifiable)
  {
      return [
          //
      ];
  }

}
