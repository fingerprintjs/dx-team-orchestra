<?php
require '../vendor/autoload.php';


use Slim\Factory\AppFactory;
use PHP_SDK\Controllers\EventsController;

$app = AppFactory::create();
$app->addErrorMiddleware(true, true, true);

$app->get('/getEvents', [EventsController::class, 'getEvents']);

$app->run();
