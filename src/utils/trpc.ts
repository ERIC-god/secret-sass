import {initTRPC} from '@trpc/server'
import z from 'zod'

/** createContext */
/** 作用：为每个tRPC请求创建上下文对象 */
export async function createTRPCContext(){
    return {
        a:1
    }
}
 
/** 初始化tRPC */
/** initTRPC.context<...>()：指定上下文类型，确保类型安全 */
/** .create()：创建tRPC实例 */
const t=initTRPC.context<typeof createTRPCContext>().create();
/** 
    解构赋值：获取三个核心组件：
    router：用于创建API路由器
    procedure：创建API端点
    middleware：创建中间件 
*/
const {router,procedure,middleware}=t;


/** trpc的中间件功能 */
const trpcMiddleWare=middleware(({ctx,next})=>{
    return next(
        {
            ctx:{               
                b:2,
            }
        }
    )
})

/** 使用中间件创建受影响的procedure  */
/** 使用这个procedure的所有端点都会有ctx.b=2可用 */
const middlewareProcedure=procedure.use(trpcMiddleWare)

/** procedure是tRPC中定义API端点的基础构建块 */
export const secretRouter=router({
    hello:procedure.query(()=>{
        return {
            a:'Hello,JavaScript!'
        }
    }),
    login:middlewareProcedure.input(z.object({id:z.string()})).query(({input,ctx})=>{
        return {
            message:'success',
            id:input.id,
            a:ctx.a,
            b:ctx.b
        }
    }) 
})

export type SecretRouter= typeof secretRouter