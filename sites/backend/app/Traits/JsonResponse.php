<?php

namespace App\Traits;

use Illuminate\Http\Response;

trait JsonResponse
{
    public function successResponse($data, $code = Response::HTTP_OK)
    {
        return response()->json([
            'data' => $data,
            'code' => $code
        ], $code);
    }

    public function errorResponse($error, $code)
    {
        return response()->json([
            'error' => $error,
            'code' => $code,
        ], $code);
    }

    public function messageResponse($message, $code = Response::HTTP_OK)
    {
        return response()->json([
            'message' => $message,
            'code' => $code,
        ], $code);
    }
}
