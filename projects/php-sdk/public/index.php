<?php
require '../vendor/autoload.php';

use Slim\Factory\AppFactory;

$app = AppFactory::create();
$app->addErrorMiddleware(true, true, true);

$app->group('', require '../src/V3/routes.php');
$app->group('/v4', require '../src/V4/routes.php');

$app->run();
