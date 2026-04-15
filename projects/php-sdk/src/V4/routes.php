<?php

use PHP_SDK\V4\Controllers\EventsController;
use PHP_SDK\V4\Controllers\SealedController;
use PHP_SDK\V4\Controllers\VisitsController;
use Slim\Routing\RouteCollectorProxy;

return function (RouteCollectorProxy $group): void {
    $group->get('/getEvent', [EventsController::class, 'getEvent']);
    $group->get('/searchEvents', [EventsController::class, 'searchEvents']);
    $group->get('/updateEvent', [EventsController::class, 'updateEvent']);

    $group->get('/deleteVisitorData', [VisitsController::class, 'deleteVisitorData']);

    $group->post('/unseal', [SealedController::class, 'unseal']);
};
