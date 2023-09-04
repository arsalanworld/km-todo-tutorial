<?php
namespace Know\TodoList\Model;

use Know\TodoList\Model\ResourceModel\Todo\CollectionFactory;
use Magento\Framework\Stdlib\DateTime\DateTime;

class TodoManagement
{
    private CollectionFactory $collectionFactory;

    private ResourceModel\Todo $resource;

    private TodoFactory $todoFactory;

    private DateTime $dateTime;

    public function __construct(
        CollectionFactory  $collectionFactory,
        ResourceModel\Todo $resource,
        TodoFactory        $todoFactory,
        DateTime $dateTime
    ) {
        $this->collectionFactory = $collectionFactory;
        $this->resource = $resource;
        $this->todoFactory = $todoFactory;
        $this->dateTime = $dateTime;
    }

    public function getTodoItems($customerId, $itemId = null): array
    {
        $collection = $this->collectionFactory->create();
        if (!empty($itemId)) {
            $collection->addFieldToFilter('entity_id', $itemId);
        }

        $collection->addFieldToFilter('customer_id', $customerId);
        $taskEntity = $collection->getConnection()->getTableName('todo_task_entity');

        $collection->getSelect()->reset(\Zend_Db_Select::COLUMNS)
            ->columns([
                'id' => 'entity_id',
                'title' => 'title',
                'description' => 'description',
                'total_tasks' => $this->getTaskCounterSqlExpr($taskEntity),
                'completed_tasks' => $this->getTaskCounterSqlExpr($taskEntity, '1'),
                'start_date' => 'DATE_FORMAT(start_date, "%d %b %Y")',
                'end_date' => 'DATE_FORMAT(start_date, "%d %b %Y")'
            ]);
        return $collection->toArray();
    }

    /**
     * @param array $todoData
     * @return array
     * @throws \Magento\Framework\Exception\AlreadyExistsException
     */
    public function createTodoItem(array $todoData): array
    {
        $todo = $this->todoFactory->create();
        if (!empty($todoData['id'])) {
            $this->resource->load($todo, $todoData['id']);
        }

        $todo->setTitle($todoData['title'])
            ->setStartDate($todoData['start_date'])
            ->setEndDate($todoData['end_date'])
            ->setUpdatedAt($this->dateTime->gmtDate('Y-m-d H:i:s'));
        if (isset($todoData['description'])) {
            $todo->setDescription($todoData['description']);
        }

        if (!$todo->getCustomerId()) {
            $todo->setCustomerId($todoData['customer_id']);
        }

        $this->resource->save($todo);
        return $this->getTodoItems($todo->getCustomerId(), $todo->getId());
    }

    public function deleteTodoItem($itemId)
    {
        $todo = $this->todoFactory->create();
        $this->resource->load($todo, $itemId);
        if (!$todo->getId()) {
            return false;
        }

        $this->resource->delete($todo);
        return true;
    }

    /**
     * @param $entity
     * @param $status
     * @return \Zend_Db_Expr
     */
    private function getTaskCounterSqlExpr($entity, $status = -1)
    {
        $sql = sprintf(
            'SELECT COUNT(*) AS count FROM %s WHERE parent_id = main_table.entity_id',
            $entity
        );
        if ($status > -1) {
            $sql .= " AND status = $status";
        }

        return new \Zend_Db_Expr("($sql)");
    }
}
