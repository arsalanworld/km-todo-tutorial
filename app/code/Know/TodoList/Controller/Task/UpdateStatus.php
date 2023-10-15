<?php
namespace Know\TodoList\Controller\Task;

use Magento\Customer\Controller\AccountInterface;
use Magento\Framework\App\Action\HttpPostActionInterface;
use Magento\Framework\App\ResponseInterface;
use Magento\Framework\Exception\LocalizedException;

class UpdateStatus extends AbstractTask implements AccountInterface, HttpPostActionInterface
{
    public function execute()
    {
        $data = $this->_getUnserializedPostData();
        if (empty($data) || !isset($data['taskId']) || !isset($data['status'])) {
            return $this->_returnErrorResponse();
        }

        try {
            return $this->_returnSuccessResponse([
                'updated' => $this->_getTaskManagement()->updateStatus($data['taskId'], $data['status'])
            ]);
        } catch (LocalizedException $e) {
            return $this->_returnErrorResponse($e->getMessage());
        }
    }
}
