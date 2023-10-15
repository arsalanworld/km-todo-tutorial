<?php
namespace Know\TodoList\Controller\Task;

use Know\TodoList\Controller\AbstractController;
use Know\TodoList\Model\TaskManagement;
use Magento\Authorization\Model\UserContextInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Framework\Serialize\Serializer\Json;

class AbstractTask extends AbstractController
{
    private $taskManagement;

    public function __construct(
        RequestInterface $request,
        Json $serializer,
        JsonFactory $jsonFactory,
        UserContextInterface $userContext,
        TaskManagement $taskManagement
    ) {
        $this->taskManagement = $taskManagement;
        parent::__construct($request, $serializer, $jsonFactory, $userContext);
    }

    protected function _getTaskManagement(): TaskManagement
    {
        return $this->taskManagement;
    }
}
