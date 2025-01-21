<?php
require '../vendor/autoload.php';


use PHP_SDK\Controllers\SealedController;
use PHP_SDK\Controllers\VisitsController;
use Slim\Factory\AppFactory;
use PHP_SDK\Controllers\EventsController;
use PHP_SDK\Controllers\RelatedVisitorsController;

$app = AppFactory::create();
$app->addErrorMiddleware(true, true, true);

$app->get('/getEvents', [EventsController::class, 'getEvents']);
$app->get('/updateEvent', [EventsController::class, 'updateEvent']);

$app->get('/getVisits', [VisitsController::class, 'getVisits']);
$app->get('/deleteVisitorData', [VisitsController::class, 'deleteVisitorData']);

$app->get('/getRelatedVisitors', [RelatedVisitorsController::class, 'getRelatedVisitors']);

$app->post('/unseal', [SealedController::class, 'unseal']);

$app->run();
