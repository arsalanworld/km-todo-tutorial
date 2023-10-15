<?php
namespace Know\TodoList\Controller;

use Magento\Authorization\Model\UserContextInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Framework\Serialize\Serializer\Json;

class AbstractController
{
    private RequestInterface $request;

    private Json $serializer;

    private JsonFactory $jsonFactory;

    private UserContextInterface $userContext;

    protected array $_postData;

    public function __construct(
        RequestInterface $request,
        Json $serializer,
        JsonFactory $jsonFactory,
        UserContextInterface $userContext
    ) {
        $this->request = $request;
        $this->serializer = $serializer;
        $this->jsonFactory = $jsonFactory;
        $this->userContext = $userContext;
    }

    protected function _getRequest(): RequestInterface
    {
        return $this->request;
    }

    protected function _getJsonResult(): \Magento\Framework\Controller\Result\Json
    {
        return $this->jsonFactory->create();
    }

    protected function _getUserContext(): UserContextInterface
    {
        return $this->userContext;
    }

    protected function _getSerializer(): Json
    {
        return $this->serializer;
    }

    protected function _getUnserializedPostData()
    {
        if (empty($this->_postData)) {
            $this->_postData = $this->_getSerializer()->unserialize(
                $this->_getRequest()->getContent()
            );
        }
        return $this->_postData;
    }

    protected function _returnSuccessResponse(array $data = [])
    {
        return $this->returnJsonResponse([
            'success' => true,
            'message' => __('Request completed successfully.'),
            'data' => $data
        ]);
    }

    protected function _returnErrorResponse(?string $message = '', array $data = [])
    {
        return $this->returnJsonResponse([
            'success' => false,
            'message' => (!empty($message) ? $message : "Something went wrong. Please try again later."),
            "data" => $data
        ]);
    }

    private function returnJsonResponse(array $response)
    {
        $json = $this->_getJsonResult();
        $json->setData($response);
        return $json;
    }
}
