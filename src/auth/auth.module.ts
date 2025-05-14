import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetToken } from './resettoken.entity';
import { EmailModule } from 'src/email/email.module';
@Module({
  imports:[TypeOrmModule.forFeature([PasswordResetToken]),EmailModule,UsersModule,PassportModule,
    JwtModule.register(
      {
        secret:'secret_key',
        signOptions:{expiresIn:'1d'},

      }
    )
  ],
  providers: [AuthService,JwtStrategy],
  controllers: [AuthController],
  exports:[AuthService],
})
export class AuthModule {}
