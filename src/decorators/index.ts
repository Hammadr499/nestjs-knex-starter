import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const ParamAndBody = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return { ...req.body, ...req.params };
  },
);

export const AuthUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest()['user'];
  },
);
