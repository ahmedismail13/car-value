import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    //Create fake services
    const users: User[] = [];

    fakeUserService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user: User = { id: Math.random(), email, password } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUserService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of the auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signUp('test@test.com', 'test1234');

    expect(user.password).not.toEqual('test1234');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if a user signs up with email that is in use', async () => {
    await service.signUp('test@test.com', 'test1234');
    try {
      await service.signUp('test@test.com', 'test1234');
    } catch (err) {
      expect(err.message).toEqual('User already exists');
    }
  });

  it('throws signin is called with an unused email', async () => {
    try {
      await service.signIn('test@test.com', 'test1234');
    } catch (err) {
      expect(err.message).toEqual('User not found');
    }
  });

  it('throws if an invalid password is provided', async () => {
    await service.signUp('test@test.com', 'test1234');
    try {
      await service.signIn('test@test.com', 'password');
    } catch (err) {
      expect(err.message).toEqual('bad password');
    }
  });

  it('returns a user if correct password is provided', async () => {
    try {
      await service.signUp('test@test.com', 'test1234');

      const user = await service.signIn('test@test.com', 'test1234');
      expect(user).toBeDefined();
    } catch (err) {
      expect(err.message).toEqual('User not found');
    }
  });
});
