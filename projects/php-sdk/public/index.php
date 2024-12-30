<?php
require '../vendor/autoload.php';


use Slim\Factory\AppFactory;
use PHP_SDK\Controllers\EventsController;

$app = AppFactory::create();
$app->addErrorMiddleware(true, true, true);

$app->get('/getEvents', [EventsController::class, 'getEvents']);
$app->get('/updateEvent', [EventsController::class, 'updateEvent']);

$app->run();
