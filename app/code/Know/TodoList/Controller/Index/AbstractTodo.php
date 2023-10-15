<?php
namespace Know\TodoList\Controller\Index;

use Know\TodoList\Model\TodoManagement;
use Magento\Authorization\Model\UserContextInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Framework\Serialize\Serializer\Json;

class AbstractTodo extends \Know\TodoList\Controller\AbstractController
{
    private TodoManagement $todoManagement;

    public function __construct(
        RequestInterface $request,
        Json $serializer,
        JsonFactory $jsonFactory,
        UserContextInterface $userContext,
        TodoManagement $todoManagement
    ) {
        $this->todoManagement = $todoManagement;
        parent::__construct($request, $serializer, $jsonFactory, $userContext);
    }

    protected function _getTodoManagement(): TodoManagement
    {
        return $this->todoManagement;
    }
}
