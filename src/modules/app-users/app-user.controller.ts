import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	UseGuards,
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiNotFoundResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { JWT_AUTH_BEARER } from '../../swagger/openapi-document.builder';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AppUsersService } from './app-users.service';
import { UpdateAppUserDto } from './dto/update.dto';

@Controller('api/v1/app-users')
export class AppUserController {
	constructor(private readonly appUsersService: AppUsersService) {}

	@Get()
	@ApiTags('Users')
	@ApiBearerAuth(JWT_AUTH_BEARER)
	@ApiOperation({ summary: 'List application users (password hash omitted)' })
	@UseGuards(JwtAuthGuard)
	findAllAppUsers() {
		return this.appUsersService.findAll();
	}

	@Get(':id')
	@ApiTags('Users')
	@ApiBearerAuth(JWT_AUTH_BEARER)
	@ApiOperation({ summary: 'Get application user by id' })
	@ApiParam({ name: 'id', type: Number })
	@ApiNotFoundResponse()
	@UseGuards(JwtAuthGuard)
	findOneAppUser(@Param('id', ParseIntPipe) id: number) {
		return this.appUsersService.findOne(id);
	}

	@Patch(':id')
	@ApiTags('Users')
	@ApiBearerAuth(JWT_AUTH_BEARER)
	@ApiOperation({ summary: 'Update application user' })
	@ApiParam({ name: 'id', type: Number })
	@ApiNotFoundResponse()
	@UseGuards(JwtAuthGuard)
	updateAppUser(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdateAppUserDto,
	) {
		return this.appUsersService.update(id, dto);
	}

	@Delete(':id')
	@ApiTags('Users')
	@ApiBearerAuth(JWT_AUTH_BEARER)
	@ApiOperation({ summary: 'Delete application user' })
	@ApiParam({ name: 'id', type: Number })
	@ApiNotFoundResponse()
	@UseGuards(JwtAuthGuard)
	removeAppUser(@Param('id', ParseIntPipe) id: number) {
		return this.appUsersService.remove(id);
	}
}
