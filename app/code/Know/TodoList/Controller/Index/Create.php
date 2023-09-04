<?php
namespace Know\TodoList\Controller\Index;

use Magento\Customer\Controller\AccountInterface;
use Magento\Framework\App\Action\HttpPostActionInterface;
use Magento\Framework\App\ResponseInterface;

class Create extends AbstractTodo implements AccountInterface, HttpPostActionInterface
{
    public function execute()
    {
        $data = $this->_getUnserializedPostData();
        if (empty($data) || !isset($data['todo'])) {
            return $this->_returnErrorResponse();
        }

        $data['todo']['customer_id'] = $this->_getUserContext()->getUserId();
        return $this->_returnSuccessResponse(
            $this->_getTodoManagement()->createTodoItem($data['todo'])
        );
    }
}
