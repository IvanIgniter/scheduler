<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class JsonResponse extends JsonResource
{
    private $status;
    private $message;

    public function __construct($resource, $status = 'success', $message = 'Success!')
    {
        parent::__construct($resource);

        $this->status   = $status;
        $this->message  = $message;
    }

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'data'      => $this->resource ?? [],
            'status'    => $this->status === 'success',
            'message'   => $this->message
        ];
    }
}
