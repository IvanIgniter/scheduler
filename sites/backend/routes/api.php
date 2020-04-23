<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::group(['prefix' => 'auth'], function () {
  Route::post('login', 'AuthController@login');

  Route::group(['middleware' => 'auth:api'], function () {
      Route::get('logout', 'AuthController@logout');
      
  });

});

Route::apiResource('schedules', 'Api\ScheduleController');
// Route::resource('schedules', 'Api\ScheduleController')->only(['index', 'store', 'show', 'update', 'destroy']);
// Route::get('schedules', 'Api\ScheduleController@index');
// Route::group(['middleware' => 'cors'], function () {
//   Route::apiResource('schedules', 'Api\ScheduleController');
// });
// Route::post('schedules', 'Api\ScheduleController@update');
Route::get('/test', function (Request $request) {
      return "testing..";
  });

  // Route::post('schedules',


