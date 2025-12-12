<?php
/**
 * 消息API接口
 * 基于CSCMS v4.0
 */

if (!defined('BASEPATH')) exit('No direct script access allowed');

class MessageApi extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('Message_model');
        $this->load->library('session');
        header('Content-Type: application/json; charset=utf-8');
    }

    /**
     * 获取消息列表
     * GET /api/message/list
     */
    public function list_messages() {
        $user_id = $this->get_user_id();
        if (!$user_id) {
            $this->json_error('请先登录', 401);
        }

        $type = $this->input->get('type'); // system, official, user, comment, like, follow
        $page = $this->input->get('page') ?: 1;
        $limit = $this->input->get('limit') ?: 20;
        $offset = ($page - 1) * $limit;

        $list = $this->Message_model->get_message_list($user_id, $type, $limit, $offset);
        $unread_count = $this->Message_model->get_unread_count($user_id, $type);

        $this->json_success(array(
            'list' => $list,
            'unread_count' => $unread_count
        ));
    }

    /**
     * 获取未读消息数
     * GET /api/message/unread_count
     */
    public function unread_count() {
        $user_id = $this->get_user_id();
        if (!$user_id) {
            $this->json_error('请先登录', 401);
        }

        $counts = array(
            'total' => 0,
            'system' => 0,
            'official' => 0,
            'user' => 0,
            'comment' => 0,
            'like' => 0,
            'follow' => 0
        );

        $types = array('system', 'official', 'user', 'comment', 'like', 'follow');

        foreach ($types as $type) {
            $count = $this->Message_model->get_unread_count($user_id, $type);
            $counts[$type] = $count;
            $counts['total'] += $count;
        }

        $this->json_success($counts);
    }

    /**
     * 标记消息为已读
     * POST /api/message/read
     */
    public function mark_read() {
        $user_id = $this->get_user_id();
        if (!$user_id) {
            $this->json_error('请先登录', 401);
        }

        $message_id = $this->input->post('message_id');
        $type = $this->input->post('type'); // 如果提供type，则标记该类型所有消息为已读

        if ($message_id) {
            // 标记单条消息为已读
            $result = $this->Message_model->mark_as_read($message_id, $user_id);
        } else if ($type) {
            // 标记某类型所有消息为已读
            $result = $this->Message_model->mark_type_as_read($user_id, $type);
        } else {
            // 标记所有消息为已读
            $result = $this->Message_model->mark_all_as_read($user_id);
        }

        if ($result) {
            $this->json_success(null, '标记成功');
        } else {
            $this->json_error('标记失败');
        }
    }

    /**
     * 删除消息
     * POST /api/message/delete
     */
    public function delete() {
        $user_id = $this->get_user_id();
        if (!$user_id) {
            $this->json_error('请先登录', 401);
        }

        $message_id = $this->input->post('message_id');

        if (!$message_id) {
            $this->json_error('参数错误');
        }

        $result = $this->Message_model->delete_message($message_id, $user_id);

        if ($result) {
            $this->json_success(null, '删除成功');
        } else {
            $this->json_error('删除失败');
        }
    }

    /**
     * 发送私信
     * POST /api/message/send
     */
    public function send() {
        $user_id = $this->get_user_id();
        if (!$user_id) {
            $this->json_error('请先登录', 401);
        }

        $to_user_id = $this->input->post('to_user_id');
        $content = $this->input->post('content');

        if (!$to_user_id || empty($content)) {
            $this->json_error('参数错误');
        }

        if ($user_id == $to_user_id) {
            $this->json_error('不能给自己发消息');
        }

        $data = array(
            'from_user_id' => $user_id,
            'to_user_id' => $to_user_id,
            'type' => 'user',
            'content' => $content,
            'create_time' => time()
        );

        $result = $this->Message_model->send_message($data);

        if ($result) {
            $this->json_success(array('message_id' => $result), '发送成功');
        } else {
            $this->json_error('发送失败');
        }
    }

    /**
     * 获取对话列表
     * GET /api/message/conversations
     */
    public function conversations() {
        $user_id = $this->get_user_id();
        if (!$user_id) {
            $this->json_error('请先登录', 401);
        }

        $page = $this->input->get('page') ?: 1;
        $limit = $this->input->get('limit') ?: 20;
        $offset = ($page - 1) * $limit;

        $list = $this->Message_model->get_conversations($user_id, $limit, $offset);

        $this->json_success(array('list' => $list));
    }

    /**
     * 获取对话详情
     * GET /api/message/conversation/:user_id
     */
    public function conversation($target_user_id = 0) {
        $user_id = $this->get_user_id();
        if (!$user_id) {
            $this->json_error('请先登录', 401);
        }

        if (!$target_user_id) {
            $this->json_error('参数错误');
        }

        $page = $this->input->get('page') ?: 1;
        $limit = $this->input->get('limit') ?: 50;
        $offset = ($page - 1) * $limit;

        $messages = $this->Message_model->get_conversation_messages($user_id, $target_user_id, $limit, $offset);

        // 标记对方发来的消息为已读
        $this->Message_model->mark_conversation_as_read($user_id, $target_user_id);

        $this->json_success(array('list' => $messages));
    }

    // ========== 辅助方法 ==========

    /**
     * 获取当前用户ID
     */
    private function get_user_id() {
        return $this->session->userdata('user_id') ?: 0;
    }

    /**
     * 返回成功JSON
     */
    private function json_success($data = array(), $message = 'success') {
        echo json_encode(array(
            'code' => 0,
            'message' => $message,
            'data' => $data
        ), JSON_UNESCAPED_UNICODE);
        exit;
    }

    /**
     * 返回错误JSON
     */
    private function json_error($message = 'error', $code = 400) {
        echo json_encode(array(
            'code' => $code,
            'message' => $message,
            'data' => null
        ), JSON_UNESCAPED_UNICODE);
        exit;
    }
}
