<?php
namespace Know\TodoList\Model;

use Magento\Framework\Model\AbstractModel;

class Todo extends AbstractModel
{
    protected function _construct()
    {
        $this->_init(ResourceModel\Todo::class);
    }
}
