@component('mail::message')
{{$title}} <br/><br/>

{{$message}} <br/><br/>

Schedule : {{$schedule['from']}} to {{$schedule['to']}}  <br/><br/>

From : {{$first_name}} {{$last_name}}<br/><br/>

@endcomponent
