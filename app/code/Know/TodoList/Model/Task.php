<?php
namespace Know\TodoList\Model;

use Magento\Framework\Model\AbstractModel;

class Task extends AbstractModel
{
    protected function _construct()
    {
        $this->_init(ResourceModel\Task::class);
    }
}
