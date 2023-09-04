<?php
namespace Know\TodoList\Controller\Index;

use Magento\Customer\Controller\AccountInterface;
use Magento\Framework\App\ResponseInterface;

class Delete extends AbstractTodo implements AccountInterface
{
    public function execute()
    {
        $data = $this->_getUnserializedPostData();
        if (empty($data) || !isset($data['todoId'])) {
            return $this->_returnErrorResponse();
        }

        try {
            $response['success'] = $this->_getTodoManagement()->deleteTodoItem($data['todoId']);
        } catch (\Exception $e) {
            return $this->_returnErrorResponse($e->getMessage());
        }

        return $this->_returnSuccessResponse($response);
    }
}
