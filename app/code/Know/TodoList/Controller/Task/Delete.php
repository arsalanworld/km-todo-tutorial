<?php
namespace Know\TodoList\Controller\Task;

use Magento\Customer\Controller\AccountInterface;
use Magento\Framework\App\Action\HttpPostActionInterface;
use Magento\Framework\App\ResponseInterface;

class Delete extends AbstractTask implements AccountInterface, HttpPostActionInterface
{
    public function execute()
    {
        $data = $this->_getUnserializedPostData();
        if (empty($data) || !isset($data['taskId'])) {
            return $this->_returnErrorResponse();
        }

        return $this->_returnSuccessResponse([
            'deleted' => $this->_getTaskManagement()->deleteItem($data['taskId'])
        ]);
    }
}
