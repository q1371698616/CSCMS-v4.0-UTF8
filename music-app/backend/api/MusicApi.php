<?php
/**
 * 音乐API接口
 * 基于CSCMS v4.0
 */

if (!defined('BASEPATH')) exit('No direct script access allowed');

class MusicApi extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('Music_model');
        $this->load->library('session');
        header('Content-Type: application/json; charset=utf-8');
    }

    /**
     * 获取音乐列表
     * GET /api/music/list
     */
    public function list_music() {
        $page = $this->input->get('page') ?: 1;
        $limit = $this->input->get('limit') ?: 20;
        $category_id = $this->input->get('category_id') ?: 0;
        $type = $this->input->get('type') ?: 'all'; // all, recommend, hot, new

        $offset = ($page - 1) * $limit;

        $where = array('status' => 1);

        if ($category_id > 0) {
            $where['category_id'] = $category_id;
        }

        $order_by = 'id DESC';

        switch ($type) {
            case 'recommend':
                $where['is_recommend'] = 1;
                break;
            case 'hot':
                $order_by = 'play_count DESC';
                break;
            case 'new':
                $where['is_new'] = 1;
                break;
        }

        $list = $this->Music_model->get_music_list($where, $limit, $offset, $order_by);
        $total = $this->Music_model->count_music($where);

        $this->json_success(array(
            'list' => $list,
            'total' => $total,
            'page' => (int)$page,
            'limit' => (int)$limit
        ));
    }

    /**
     * 获取音乐详情
     * GET /api/music/detail/:id
     */
    public function detail($id = 0) {
        if (!$id) {
            $this->json_error('参数错误');
        }

        $music = $this->Music_model->get_music_by_id($id);

        if (!$music) {
            $this->json_error('音乐不存在');
        }

        // 检查是否需要VIP权限
        if ($music['is_vip'] == 1) {
            $user_id = $this->get_user_id();
            if (!$this->check_user_vip($user_id)) {
                $music['music_url'] = '';
                $music['need_vip'] = true;
            }
        }

        // 增加播放次数
        $this->Music_model->increase_play_count($id);

        $this->json_success($music);
    }

    /**
     * 搜索音乐
     * GET /api/music/search
     */
    public function search() {
        $keyword = $this->input->get('keyword');
        $page = $this->input->get('page') ?: 1;
        $limit = $this->input->get('limit') ?: 20;

        if (empty($keyword)) {
            $this->json_error('请输入搜索关键词');
        }

        $offset = ($page - 1) * $limit;

        $result = $this->Music_model->search_music($keyword, $limit, $offset);

        $this->json_success($result);
    }

    /**
     * 播放音乐
     * POST /api/music/play
     */
    public function play() {
        $user_id = $this->get_user_id();
        if (!$user_id) {
            $this->json_error('请先登录', 401);
        }

        $music_id = $this->input->post('music_id');
        $play_progress = $this->input->post('play_progress') ?: 0;
        $device = $this->input->post('device') ?: 'unknown';

        if (!$music_id) {
            $this->json_error('参数错误');
        }

        // 记录播放历史
        $data = array(
            'user_id' => $user_id,
            'music_id' => $music_id,
            'play_progress' => $play_progress,
            'device' => $device,
            'create_time' => time()
        );

        $this->Music_model->add_play_history($data);

        $this->json_success(array('message' => '播放记录已保存'));
    }

    /**
     * 收藏音乐
     * POST /api/music/collect
     */
    public function collect() {
        $user_id = $this->get_user_id();
        if (!$user_id) {
            $this->json_error('请先登录', 401);
        }

        $music_id = $this->input->post('music_id');

        if (!$music_id) {
            $this->json_error('参数错误');
        }

        $result = $this->Music_model->toggle_collection($user_id, 'music', $music_id);

        $this->json_success(array(
            'is_collected' => $result,
            'message' => $result ? '收藏成功' : '取消收藏'
        ));
    }

    /**
     * 点赞音乐
     * POST /api/music/like
     */
    public function like() {
        $user_id = $this->get_user_id();
        if (!$user_id) {
            $this->json_error('请先登录', 401);
        }

        $music_id = $this->input->post('music_id');

        if (!$music_id) {
            $this->json_error('参数错误');
        }

        $result = $this->Music_model->toggle_like($user_id, 'music', $music_id);

        $this->json_success(array(
            'is_liked' => $result,
            'message' => $result ? '点赞成功' : '取消点赞'
        ));
    }

    /**
     * 获取播放历史
     * GET /api/music/history
     */
    public function history() {
        $user_id = $this->get_user_id();
        if (!$user_id) {
            $this->json_error('请先登录', 401);
        }

        $page = $this->input->get('page') ?: 1;
        $limit = $this->input->get('limit') ?: 20;
        $offset = ($page - 1) * $limit;

        $list = $this->Music_model->get_play_history($user_id, $limit, $offset);

        $this->json_success(array('list' => $list));
    }

    /**
     * 获取音乐分类
     * GET /api/music/categories
     */
    public function categories() {
        $list = $this->Music_model->get_categories();
        $this->json_success(array('list' => $list));
    }

    /**
     * 获取推荐音乐
     * GET /api/music/recommend
     */
    public function recommend() {
        $user_id = $this->get_user_id();
        $limit = $this->input->get('limit') ?: 10;

        // 基于用户喜好推荐
        $list = $this->Music_model->get_recommend_music($user_id, $limit);

        $this->json_success(array('list' => $list));
    }

    // ========== 辅助方法 ==========

    /**
     * 获取当前用户ID
     */
    private function get_user_id() {
        return $this->session->userdata('user_id') ?: 0;
    }

    /**
     * 检查用户VIP状态
     */
    private function check_user_vip($user_id) {
        if (!$user_id) return false;

        $this->load->model('User_model');
        $user = $this->User_model->get_user_by_id($user_id);

        if (!$user) return false;

        return $user['vip'] == 1 && $user['viptime'] > time();
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
