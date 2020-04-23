<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\JsonResponse;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Response;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

abstract class AbstractController extends Controller
{
    use JsonResponse;

    protected $headers = [];

    protected $httpStatusCode = Response::HTTP_OK; // OK

    public function __construct(Collection $collection)
    {
        $this->data = $collection;
    }

    protected function setHeaders(array $headers)
    {
        $this->headers = $headers;

        return $this;
    }

    protected function setHTTPStatusCode($statusCode)
    {
        $this->httpStatusCode = $statusCode;

        return $this;
    }

    protected function jsonResponse($data = null)
    {
        return response()->json($data, (int) $this->httpStatusCode, $this->headers);
    }

    protected function showAll(Collection $collection, $paginate = true)
    {
        // OMG!
        // WTH IS THIS?
        // Please refactor this
        if ($collection->isEmpty()) {
            $collection = $this->paginate($collection);

            return $this->jsonResponse([
                'data' => [],
                'meta' => Arr::except($collection->toArray(), ['data'])
            ]);
        }

        // Get resource
        $resource = $this->getResource($collection);

        // filter data
        $collection = $this->filter($collection, $resource);

        // sort data
        $collection = $this->sort($collection, $resource);

        $collection = $this->paginate($collection);

        // transform
        $transformedData = $this->transform($collection, $resource);

        // ?cache
        return $this->jsonResponse($transformedData);
    }

    protected function showAllWithoutPaginate($collection)
    {
        // OMG!
        // WTH IS THIS?
        // Please refactor this
        if ($collection->isEmpty()) {
            return $this->jsonResponse(['data' => $collection]);
        }

        // Get resource
        $resource = $this->getResource($collection);

        // filter data
        $collection = $this->filter($collection, $resource);

        // sort data
        $collection = $this->sort($collection, $resource);

        // transform
        $transformedData = $this->transform($collection, $resource);

        // ?cache
        return $this->jsonResponse($transformedData);
    }

    protected function showOne(Model $instance)
    {
        $resource = $instance->resource;
        $transformedData = $this->transform($instance, $resource);

        return $this->jsonResponse($transformedData);
    }

    protected function getResource(Collection $collection)
    {
        return $collection->first()->resource;
    }

    protected function filter(Collection $collection, $resource)
    {
        $requestQuery = $this->requestQuery();

        foreach ($requestQuery as $query => $value) {
            if (isset($query, $value)) {
                $collection = $collection->where($query, $value);
            }
        }

        return $collection;
    }

    protected function requestQuery()
    {
        $requestQuery = request()->query();

        // Removed q in our request
        if (isset($requestQuery['q'])) {
            unset($requestQuery['q']);
        }

        if (isset($requestQuery['subject'])) {
            unset($requestQuery['subject']);
        }

        if (isset($requestQuery['page'])) {
            unset($requestQuery['page']);
        }

        if (isset($requestQuery['sort_by'])) {
            unset($requestQuery['sort_by']);
        }

        if (isset($requestQuery['order_by'])) {
            unset($requestQuery['order_by']);
        }

        return $requestQuery;
    }

    protected function sort($collection, $resource)
    {
        if (!request()->has('sort_by')) {
            return $collection;
        }

        if (request()->has('order_by') && request()->order_by === 'desc') {
            return  $collection->sortByDesc(request()->sort_by);
        }

        // $attribute = $resource::originalAttribute(request()->sort_by);
        return  $collection->sortBy(request()->sort_by);
    }

    protected function paginate($collection)
    {
        // $rules = [
        //     'per_page' => 'integer|min:2|max:50'
        // ];
        $perPage = request()->per_page ?: 5;
        $page = LengthAwarePaginator::resolveCurrentPage();
        $results = $collection->slice(($page - 1) * $perPage, $perPage)->values();
        $paginated = new LengthAwarePaginator(
            $results,
            $collection->count(),
            $perPage,
            $page,
            ['path' => LengthAwarePaginator::resolveCurrentPath()]
        );

        $paginated->appends(request()->all());

        return $paginated;
    }

    protected function transform($data, $resource)
    {
        if ($data instanceof LengthAwarePaginator) {
            return [
                'data' => $resource::collection($data),
                'meta' => Arr::except($data->toArray(), ['data'])
            ];
        }

        if ($data instanceof Model) {
            return ['data' => new $resource($data)];
        }

        return ['data' => $resource::collection($data)];
    }
}
