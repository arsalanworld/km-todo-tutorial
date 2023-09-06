<?php
namespace Know\TodoList\Model;

use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Stdlib\DateTime\DateTime;

class TaskManagement
{
    private TaskFactory $taskFactory;

    private ResourceModel\Task $resource;

    private ResourceModel\Task\CollectionFactory $collectionFactory;

    private DateTime $dateTime;

    public function __construct(
        TaskFactory $taskFactory,
        ResourceModel\Task $resource,
        ResourceModel\Task\CollectionFactory $collectionFactory,
        DateTime $dateTime
    ) {
        $this->taskFactory = $taskFactory;
        $this->resource = $resource;
        $this->collectionFactory = $collectionFactory;
        $this->dateTime = $dateTime;
    }

    public function getTasks($todoId, $taskId = null): array
    {
        $collection = $this->collectionFactory->create();
        if (!empty($taskId)) {
            $collection->addFieldToFilter('entity_id', $taskId);
        }

        $collection->addFieldToFilter('parent_id', $todoId);
        $collection->getSelect()->columns(['id' => 'entity_id', 'parentId' => 'parent_id']);
        return $collection->toArray();
    }

    public function saveItem(array $taskData): array
    {
        $task = $this->taskFactory->create();
        if (!empty($taskData['id'])) {
            $task = $this->loadTask($taskData['id']);
        }

        $task->setTitle($taskData['title'])
            ->setStatus($taskData['status'])
            ->setParentId($taskData['parentId'])
            ->setUpdatedAt($this->dateTime->gmtDate('Y-m-d H:i:s'));
        $this->resource->save($task);
        return $this->getTasks($task->getParentId(), $task->getId());
    }

    public function deleteItem($taskId)
    {
        $task = $this->loadTask($taskId);
        try {
            if (empty($task->getId())) {
                throw new LocalizedException(__('No task found with ID %1', $taskId));
            }

            $this->resource->delete($task);
        } catch (LocalizedException $e) {
            // You can customize exception your way
            return false;
        }

        return true;
    }

    public function updateStatus($taskId, int $status = 0)
    {
        $task = $this->loadTask($taskId);
        if (empty($task->getId())) {
            throw new LocalizedException(__('No task found with ID %1', $taskId));
        }

        $task->setStatus($status);
        $this->resource->save($task);
        return (int) $task->getStatus() === $status;
    }

    private function loadTask($taskId): Task
    {
        $task = $this->taskFactory->create();
        $this->resource->load($task, $taskId);
        return $task;
    }
}
