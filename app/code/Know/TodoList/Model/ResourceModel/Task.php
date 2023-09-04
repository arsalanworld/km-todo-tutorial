<?php
namespace Know\TodoList\Model\ResourceModel;

use Magento\Framework\Model\ResourceModel\Db\AbstractDb;

class Task extends AbstractDb
{
    protected function _construct()
    {
        $this->_init('todo_task_entity', 'entity_id');
    }
}
