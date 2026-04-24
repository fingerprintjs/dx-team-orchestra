<?php

use PHP_SDK\V3\Controllers\EventsController;
use PHP_SDK\V3\Controllers\RelatedVisitorsController;
use PHP_SDK\V3\Controllers\SealedController;
use PHP_SDK\V3\Controllers\VisitsController;
use Slim\Routing\RouteCollectorProxy;

return function (RouteCollectorProxy $group): void {
    $group->get('/getEvents', [EventsController::class, 'getEvents']);
    $group->get('/searchEvents', [EventsController::class, 'searchEvents']);
    $group->get('/updateEvent', [EventsController::class, 'updateEvent']);

    $group->get('/getVisits', [VisitsController::class, 'getVisits']);
    $group->get('/deleteVisitorData', [VisitsController::class, 'deleteVisitorData']);

    $group->get('/getRelatedVisitors', [RelatedVisitorsController::class, 'getRelatedVisitors']);

    $group->post('/unseal', [SealedController::class, 'unseal']);
};
