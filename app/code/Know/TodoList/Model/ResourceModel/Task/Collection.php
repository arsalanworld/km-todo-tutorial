<?php
namespace Know\TodoList\Model\ResourceModel\Task;

use Know\TodoList\Model\Task;
use Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection;

class Collection extends AbstractCollection
{
    protected function _construct()
    {
        $this->_init(Task::class, \Know\TodoList\Model\ResourceModel\Task::class);
    }
}
