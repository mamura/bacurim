<?php
require '/app/vendor/autoload.php';
$app = require '/app/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;

if (getenv('BACURIM_E2E') !== 'true' || !$app->environment('testing') || config('database.connections.pgsql.host') !== 'database' || DB::connection()->getDatabaseName() !== 'bacurim_test' || config('database.redis.default.host') !== 'cache') {
    throw new RuntimeException('Isolated E2E environment required.');
}
$action = $argv[1] ?? 'reset';
if ($action === 'expire') {
    DB::table('sessions')->update(['last_activity' => time() - 86400]);
    exit(0);
}
if ($action === 'revoke') {
    $id = DB::table('users')->where('email', 'consultant@e2e.test')->value('id');
    DB::table('organization_memberships')->where('user_id', $id)->where('organization_id', 1)->update(['status' => 'revoked', 'revoked_at' => now(), 'version' => DB::raw('version + 1')]);
    exit(0);
}
if ($action !== 'reset') throw new RuntimeException('Unsupported fixture operation.');
DB::statement('TRUNCATE organization_memberships, organizations, users, sessions RESTART IDENTITY CASCADE');
Cache::store('auth_limits')->flush();
$now = now();
foreach (['Alfa', 'Beta'] as $index => $name) {
    DB::table('organizations')->insert(['public_id' => sprintf('10000000-0000-4000-8000-%012d', $index + 1), 'name' => 'Empresa '.$name, 'legal_name' => null, 'document' => null, 'status' => 'active', 'version' => 1, 'created_at' => $now, 'updated_at' => $now]);
}
$password = Hash::make('E2e-only-password!42');
$accounts = [
    'owner' => ['standard', 'owner'], 'admin' => ['standard', 'admin'],
    'member' => ['standard', 'member'], 'viewer' => ['standard', 'viewer'],
    'empty' => ['standard', null], 'consultant' => ['consultant', 'viewer'],
    'consultant-empty' => ['consultant', null], 'consultant-one' => ['consultant', 'admin'],
    'inactive' => ['standard', null],
];
$membership = 0;
foreach ($accounts as $name => [$profile, $role]) {
    $id = DB::table('users')->insertGetId(['public_id' => sprintf('20000000-0000-4000-8000-%012d', count(DB::table('users')->get()) + 1), 'name' => 'Pessoa '.ucfirst($name), 'email' => $name.'@e2e.test', 'password' => $password, 'profile' => $profile, 'status' => $name === 'inactive' ? 'inactive' : 'active', 'version' => 1, 'email_verified_at' => $now, 'created_at' => $now, 'updated_at' => $now]);
    if ($role !== null) {
        foreach ($name === 'consultant' ? [1, 2] : [1] as $organizationId) {
            DB::table('organization_memberships')->insert(['public_id' => sprintf('30000000-0000-4000-8000-%012d', ++$membership), 'organization_id' => $organizationId, 'user_id' => $id, 'role' => $name === 'consultant' && $organizationId === 2 ? 'admin' : $role, 'status' => 'active', 'version' => 1, 'revoked_at' => null, 'created_at' => $now, 'updated_at' => $now]);
        }
    }
}
echo "Isolated fixtures ready.\n";
