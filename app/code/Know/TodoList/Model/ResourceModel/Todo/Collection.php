<?php
namespace Know\TodoList\Model\ResourceModel\Todo;

use Know\TodoList\Model\Todo;
use Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection;

class Collection extends AbstractCollection
{
    protected function _construct()
    {
        $this->_init(Todo::class, \Know\TodoList\Model\ResourceModel\Todo::class);
    }
}
