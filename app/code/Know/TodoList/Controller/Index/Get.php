<?php
namespace Know\TodoList\Controller\Index;

use Know\TodoList\Model\TodoManagement;
use Magento\Authorization\Model\UserContextInterface;
use Magento\Customer\Controller\AccountInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\App\ResponseInterface;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Framework\Serialize\Serializer\Json;

class Get extends AbstractTodo implements AccountInterface
{
    public function execute()
    {
        $id = $this->_getRequest()->getParam('id');
        return $this->_getJsonResult()->setData(
            $this->_getTodoManagement()->getTodoItems($this->_getUserContext()->getUserId(), $id)
        );
    }
}
