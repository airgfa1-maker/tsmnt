# GitHub 推送指南

## ✅ 已完成

1. **本地 Git 仓库** - 已初始化并提交了所有源代码
2. **SSH 密钥对** - 已生成（Ed25519 格式）
3. **远程仓库配置** - 已添加 GitHub 远程地址

**远程仓库：** `git@github.com:airgfa1-maker/tsmnt.git`

---

## 🔑 SSH 公钥配置

**公钥内容：**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIILbSObT01Nnb3MDdl5j5i1Vm8/9ZhR7TAZ3Wc8gCYQA dev@tsmainite.local
```

**密钥位置：**
- 公钥：`C:\Users\AC\.ssh\id_ed25519.pub`
- 私钥：`C:\Users\AC\.ssh\id_ed25519`（保密）

---

## 📝 配置步骤

### 第一步：添加 SSH 公钥到 GitHub

1. 访问 GitHub SSH 设置：https://github.com/settings/keys
2. 点击 **New SSH key** 按钮
3. **Title** 字段：输入 `Dev Machine` 或你的电脑名称
4. **Key type**：选择 `Authentication Key`
5. **Key** 字段：粘贴上面的公钥内容（从 `ssh-ed25519` 开始到最后）
6. 点击 **Add SSH key** 保存

### 第二步：验证 SSH 连接

完成上述配置后，运行以下命令验证连接：

```bash
ssh -T git@github.com
```

成功后会显示：
```
Hi airgfa1-maker! You've successfully authenticated, but GitHub does not provide shell access.
```

### 第三步：推送代码到 GitHub

添加 SSH 密钥后，运行：

```bash
cd c:\Users\AC\Desktop\MntLocal
git push -u origin master
```

成功推送后，你可以在 GitHub 网页上看到所有代码。

---

## 📦 当前仓库状态

- **分支：** master
- **提交数：** 1
- **文件数：** 139
- **提交内容：** tsmainite 企业网站系统完整代码

---

## 🔄 后续开发工作流

每次修改代码后，使用以下命令推送到 GitHub：

```bash
git add .
git commit -m "你的提交信息"
git push
```

---

## 🆘 常见问题

**问：推送时显示 "permission denied"？**
- 答：确认 SSH 公钥已正确添加到 GitHub 设置中

**问：如何修改提交历史？**
- 答：使用 `git rebase` 或 `git commit --amend`（谨慎操作）

**问：想用 HTTPS 而不是 SSH？**
- 答：运行 `git remote set-url origin https://github.com/airgfa1-maker/tsmnt.git`

---

**祝你编码愉快！** 🚀
