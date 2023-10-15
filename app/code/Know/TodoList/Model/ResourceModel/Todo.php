<?php
namespace Know\TodoList\Model\ResourceModel;

class Todo extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{
    protected function _construct()
    {
        $this->_init('todo_entity', 'entity_id');
    }
}
