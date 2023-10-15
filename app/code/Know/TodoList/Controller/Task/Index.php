<?php
namespace Know\TodoList\Controller\Task;

use Magento\Customer\Controller\AccountInterface;
use Magento\Framework\App\ResponseInterface;

class Index extends AbstractTask implements AccountInterface
{
    public function execute()
    {
        $id = $this->_getRequest()->getParam('id');
        $parentId = $this->_getRequest()->getParam('parentId');
        return $this->_returnSuccessResponse(
            $this->_getTaskManagement()->getTasks($parentId, $id)
        );
    }
}
