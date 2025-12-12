<?php
/**
 * 用户API接口
 * 基于CSCMS v4.0
 */

if (!defined('BASEPATH')) exit('No direct script access allowed');

class UserApi extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('User_model');
        $this->load->library('session');
        header('Content-Type: application/json; charset=utf-8');
    }

    /**
     * 用户注册
     * POST /api/user/register
     */
    public function register() {
        $username = $this->input->post('username');
        $password = $this->input->post('password');
        $email = $this->input->post('email');
        $phone = $this->input->post('phone');
        $code = $this->input->post('code'); // 验证码

        // 验证参数
        if (empty($username) || empty($password)) {
            $this->json_error('用户名和密码不能为空');
        }

        if (!empty($email)) {
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $this->json_error('邮箱格式不正确');
            }

            // 检查邮箱是否已存在
            if ($this->User_model->check_email_exists($email)) {
                $this->json_error('邮箱已被注册');
            }
        }

        if (!empty($phone)) {
            if (!preg_match('/^1[3-9]\d{9}$/', $phone)) {
                $this->json_error('手机号格式不正确');
            }

            // 检查手机号是否已存在
            if ($this->User_model->check_phone_exists($phone)) {
                $this->json_error('手机号已被注册');
            }
        }

        // 检查用户名是否已存在
        if ($this->User_model->check_username_exists($username)) {
            $this->json_error('用户名已存在');
        }

        // 创建用户
        $user_data = array(
            'name' => $username,
            'pass' => md5($password),
            'code' => substr(md5(mt_rand()), 0, 6),
            'email' => $email,
            'tel' => $phone,
            'regip' => $this->input->ip_address(),
            'logip' => $this->input->ip_address(),
            'addtime' => time(),
            'logtime' => time(),
            'zid' => 1, // 默认用户组
            'yid' => 1, // 已激活
            'logo' => '/assets/default_avatar.png'
        );

        $user_id = $this->User_model->create_user($user_data);

        if ($user_id) {
            // 自动登录
            $this->session->set_userdata('user_id', $user_id);
            $this->session->set_userdata('username', $username);

            $this->json_success(array(
                'user_id' => $user_id,
                'username' => $username,
                'token' => $this->generate_token($user_id)
            ), '注册成功');
        } else {
            $this->json_error('注册失败，请重试');
        }
    }

    /**
     * 用户登录
     * POST /api/user/login
     */
    public function login() {
        $username = $this->input->post('username');
        $password = $this->input->post('password');

        if (empty($username) || empty($password)) {
            $this->json_error('用户名和密码不能为空');
        }

        $user = $this->User_model->get_user_by_username($username);

        if (!$user) {
            // 尝试用邮箱登录
            $user = $this->User_model->get_user_by_email($username);
        }

        if (!$user) {
            // 尝试用手机号登录
            $user = $this->User_model->get_user_by_phone($username);
        }

        if (!$user) {
            $this->json_error('用户不存在');
        }

        if ($user['pass'] !== md5($password)) {
            $this->json_error('密码错误');
        }

        if ($user['sid'] == 1) {
            $this->json_error('账号已被锁定');
        }

        // 更新登录信息
        $this->User_model->update_login_info($user['id'], array(
            'logip' => $this->input->ip_address(),
            'logtime' => time(),
            'lognum' => $user['lognum'] + 1
        ));

        // 设置session
        $this->session->set_userdata('user_id', $user['id']);
        $this->session->set_userdata('username', $user['name']);

        $this->json_success(array(
            'user_id' => $user['id'],
            'username' => $user['name'],
            'nickname' => $user['nichen'],
            'avatar' => $user['logo'],
            'vip' => $user['vip'],
            'token' => $this->generate_token($user['id'])
        ), '登录成功');
    }

    /**
     * 获取用户信息
     * GET /api/user/profile
     */
    public function profile($user_id = 0) {
        if (!$user_id) {
            $user_id = $this->get_user_id();
        }

        if (!$user_id) {
            $this->json_error('请先登录', 401);
        }

        $user = $this->User_model->get_user_detail($user_id);

        if (!$user) {
            $this->json_error('用户不存在');
        }

        // 获取统计数据
        $stats = $this->User_model->get_user_stats($user_id);

        $user['stats'] = $stats;

        // 移除敏感信息
        unset($user['pass']);
        unset($user['code']);

        $this->json_success($user);
    }

    /**
     * 更新用户信息
     * PUT /api/user/profile
     */
    public function update_profile() {
        $user_id = $this->get_user_id();
        if (!$user_id) {
            $this->json_error('请先登录', 401);
        }

        $data = array();

        $nickname = $this->input->post('nickname');
        if (!empty($nickname)) {
            $data['nichen'] = $nickname;
        }

        $avatar = $this->input->post('avatar');
        if (!empty($avatar)) {
            $data['logo'] = $avatar;
        }

        $sex = $this->input->post('sex');
        if ($sex !== null) {
            $data['sex'] = intval($sex);
        }

        $city = $this->input->post('city');
        if (!empty($city)) {
            $data['city'] = $city;
        }

        $signature = $this->input->post('signature');
        if ($signature !== null) {
            $data['qianm'] = $signature;
        }

        if (empty($data)) {
            $this->json_error('没有要更新的数据');
        }

        $result = $this->User_model->update_user($user_id, $data);

        if ($result) {
            $this->json_success(null, '更新成功');
        } else {
            $this->json_error('更新失败');
        }
    }

    /**
     * 用户签到
     * POST /api/user/checkin
     */
    public function checkin() {
        $user_id = $this->get_user_id();
        if (!$user_id) {
            $this->json_error('请先登录', 401);
        }

        $user = $this->User_model->get_user_by_id($user_id);

        // 检查今天是否已签到
        if (date('Ymd', $user['qdtime']) == date('Ymd')) {
            $this->json_error('今天已经签到过了');
        }

        // 计算签到奖励
        $coin_reward = 10; // 基础金币奖励
        $exp_reward = 5;   // 基础经验奖励

        // 连续签到额外奖励
        if (date('Ymd', $user['qdtime']) == date('Ymd', strtotime('-1 day'))) {
            $days = $user['qdts'] + 1;
            if ($days >= 7) {
                $coin_reward = 50;
                $exp_reward = 20;
            }
        } else {
            $days = 1;
        }

        // 更新用户数据
        $this->User_model->update_user($user_id, array(
            'qdts' => $days,
            'qdtime' => time(),
            'cion' => $user['cion'] + $coin_reward,
            'jinyan' => $user['jinyan'] + $exp_reward
        ));

        $this->json_success(array(
            'days' => $days,
            'coin_reward' => $coin_reward,
            'exp_reward' => $exp_reward
        ), '签到成功');
    }

    /**
     * 关注用户
     * POST /api/user/follow
     */
    public function follow() {
        $user_id = $this->get_user_id();
        if (!$user_id) {
            $this->json_error('请先登录', 401);
        }

        $follow_user_id = $this->input->post('follow_user_id');

        if (!$follow_user_id) {
            $this->json_error('参数错误');
        }

        if ($user_id == $follow_user_id) {
            $this->json_error('不能关注自己');
        }

        $result = $this->User_model->toggle_follow($user_id, $follow_user_id);

        $this->json_success(array(
            'is_followed' => $result,
            'message' => $result ? '关注成功' : '取消关注'
        ));
    }

    /**
     * 获取关注列表
     * GET /api/user/following
     */
    public function following($user_id = 0) {
        if (!$user_id) {
            $user_id = $this->get_user_id();
        }

        if (!$user_id) {
            $this->json_error('请先登录', 401);
        }

        $page = $this->input->get('page') ?: 1;
        $limit = $this->input->get('limit') ?: 20;
        $offset = ($page - 1) * $limit;

        $list = $this->User_model->get_following_list($user_id, $limit, $offset);

        $this->json_success(array('list' => $list));
    }

    /**
     * 获取粉丝列表
     * GET /api/user/followers
     */
    public function followers($user_id = 0) {
        if (!$user_id) {
            $user_id = $this->get_user_id();
        }

        if (!$user_id) {
            $this->json_error('请先登录', 401);
        }

        $page = $this->input->get('page') ?: 1;
        $limit = $this->input->get('limit') ?: 20;
        $offset = ($page - 1) * $limit;

        $list = $this->User_model->get_followers_list($user_id, $limit, $offset);

        $this->json_success(array('list' => $list));
    }

    /**
     * 退出登录
     * POST /api/user/logout
     */
    public function logout() {
        $this->session->unset_userdata('user_id');
        $this->session->unset_userdata('username');
        $this->session->sess_destroy();

        $this->json_success(null, '退出成功');
    }

    // ========== 辅助方法 ==========

    /**
     * 获取当前用户ID
     */
    private function get_user_id() {
        return $this->session->userdata('user_id') ?: 0;
    }

    /**
     * 生成Token
     */
    private function generate_token($user_id) {
        return md5($user_id . time() . mt_rand());
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
