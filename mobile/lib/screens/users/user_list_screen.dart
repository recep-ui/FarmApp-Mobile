import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/user_service.dart';
import '../../models/user.dart';
import '../../constants/app_colors.dart';
import 'user_form_screen.dart';

class UserListScreen extends StatefulWidget {
  const UserListScreen({super.key});

  @override
  State<UserListScreen> createState() => _UserListScreenState();
}

class _UserListScreenState extends State<UserListScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(
      () => Provider.of<UserService>(context, listen: false).fetchUsers(),
    );
  }

  Future<void> _refreshUsers() async {
    await Provider.of<UserService>(context, listen: false).fetchUsers();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('User Management'),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
      body: Consumer<UserService>(
        builder: (context, userService, child) {
          if (userService.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (userService.users.isEmpty) {
            return const Center(child: Text('No users found'));
          }

          return RefreshIndicator(
            onRefresh: _refreshUsers,
            child: ListView.builder(
              padding: const EdgeInsets.all(8),
              itemCount: userService.users.length,
              itemBuilder: (context, index) {
                final user = userService.users[index];
                return Card(
                  elevation: 2,
                  margin: const EdgeInsets.symmetric(
                    vertical: 4,
                    horizontal: 8,
                  ),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: user.role == 'admin'
                          ? Colors.redAccent
                          : AppColors.primary,
                      child: Text(
                        user.firstName.isNotEmpty
                            ? user.firstName[0].toUpperCase()
                            : '?',
                        style: const TextStyle(color: Colors.white),
                      ),
                    ),
                    title: Text('${user.firstName} ${user.lastName}'),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('@${user.username}'),
                        Text(
                          user.role.toUpperCase(),
                          style: TextStyle(
                            color: user.role == 'admin'
                                ? Colors.red
                                : Colors.grey[700],
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Active/Inactive Indicator
                        Icon(
                          Icons.circle,
                          size: 12,
                          color: user.isActive ? Colors.green : Colors.grey,
                        ),
                        const SizedBox(width: 8),
                        const Icon(Icons.chevron_right),
                      ],
                    ),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => UserFormScreen(user: user),
                        ),
                      );
                    },
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
