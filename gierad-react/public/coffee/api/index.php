<?php
// ==============================================================================
// Coffee Tracker API for Dreamhost (PHP + SQLite)
// ==============================================================================

// Ensure headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Optional config file for GEMINI_API_KEY or custom DB path
$config = [];
if (file_exists(__DIR__ . '/config.php')) {
    $config = include __DIR__ . '/config.php';
}

// 1. Locate Database File (persistent location)
// If a custom path outside webroot is set, use it; otherwise use protected ./data/ folder
$db_file = null;
if (!empty($config['db_path'])) {
    $db_file = $config['db_path'];
} elseif (file_exists('/home/gierad/coffee_data/coffee.sqlite')) {
    $db_file = '/home/gierad/coffee_data/coffee.sqlite';
} else {
    $data_dir = __DIR__ . '/data';
    if (!is_dir($data_dir)) {
        @mkdir($data_dir, 0755, true);
        // Create an .htaccess inside data directory to deny HTTP access to sqlite file
        @file_put_contents($data_dir . '/.htaccess', "Deny from all\n");
    }
    $db_file = $data_dir . '/coffee.sqlite';
}

// 2. Initialize SQLite PDO
try {
    $pdo = new PDO("sqlite:" . $db_file);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("PRAGMA journal_mode = WAL;");
    
    // Create beans table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS beans (
            name TEXT PRIMARY KEY,
            data TEXT NOT NULL,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ");

    // Auto-seed if database is empty
    $count = $pdo->query("SELECT COUNT(*) FROM beans")->fetchColumn();
    if ($count == 0 && file_exists(__DIR__ . '/seed_beans.json')) {
        $seed_json = file_get_contents(__DIR__ . '/seed_beans.json');
        $seed_data = json_decode($seed_json, true);
        if (is_array($seed_data)) {
            $stmt = $pdo->prepare("INSERT INTO beans (name, data) VALUES (:name, :data)");
            foreach ($seed_data as $bname => $bval) {
                $stmt->execute([
                    ':name' => $bname,
                    ':data' => json_encode($bval)
                ]);
            }
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database initialization failed: " . $e->getMessage()]);
    exit;
}

// 3. Parse Request Method and Path
$method = $_SERVER['REQUEST_METHOD'];
$request_uri = $_SERVER['REQUEST_URI'];

// Strip query parameters
$path = parse_url($request_uri, PHP_URL_PATH);

// Normalize path relative to /coffee/api/ or /api/
$path = preg_replace('#^.*?/coffee/api#', '', $path);
$path = preg_replace('#^.*?/api#', '', $path);
$path = trim($path, '/');
$segments = $path ? explode('/', $path) : [];

$resource = $segments[0] ?? '';
$param = isset($segments[1]) ? urldecode($segments[1]) : null;

// Read JSON Body
$raw_input = file_get_contents('php://input');
$body = json_decode($raw_input, true) ?? [];

// 4. Route Execution
try {
    // --- /beans ---
    if ($resource === 'beans') {
        if ($method === 'GET') {
            $stmt = $pdo->query("SELECT name, data FROM beans ORDER BY name ASC");
            $result = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $result[$row['name']] = json_decode($row['data'], true);
            }
            echo json_encode($result);
            exit;
        }

        if ($method === 'POST') {
            if ($param) {
                // Upsert single bean: POST /beans/{name}
                $bean_name = $param;
                $stmt = $pdo->prepare("SELECT data FROM beans WHERE name = :name");
                $stmt->execute([':name' => $bean_name]);
                $existing_row = $stmt->fetch(PDO::FETCH_ASSOC);

                $existing_data = $existing_row ? json_decode($existing_row['data'], true) : [];
                $merged = array_merge($existing_data, $body);

                // Deep merge nested espresso/pourover/oat if present
                if (isset($body['espresso']) && is_array($body['espresso'])) {
                    $merged['espresso'] = array_merge($existing_data['espresso'] ?? [], $body['espresso']);
                }
                if (isset($body['pourover']) && is_array($body['pourover'])) {
                    $merged['pourover'] = array_merge($existing_data['pourover'] ?? [], $body['pourover']);
                }
                if (isset($body['oat']) && is_array($body['oat'])) {
                    $merged['oat'] = array_merge($existing_data['oat'] ?? [], $body['oat']);
                }

                $save_stmt = $pdo->prepare("
                    INSERT INTO beans (name, data, updated_at) 
                    VALUES (:name, :data, CURRENT_TIMESTAMP)
                    ON CONFLICT(name) DO UPDATE SET data = :data, updated_at = CURRENT_TIMESTAMP
                ");
                $save_stmt->execute([
                    ':name' => $bean_name,
                    ':data' => json_encode($merged)
                ]);

                echo json_encode(["status" => "saved", "bean" => $merged]);
                exit;
            } else {
                // Bulk replace / restore: POST /beans
                $pdo->beginTransaction();
                $pdo->exec("DELETE FROM beans");
                $insert_stmt = $pdo->prepare("INSERT INTO beans (name, data) VALUES (:name, :data)");
                foreach ($body as $bname => $bval) {
                    $insert_stmt->execute([
                        ':name' => $bname,
                        ':data' => json_encode($bval)
                    ]);
                }
                $pdo->commit();
                echo json_encode(["status" => "saved", "count" => count($body)]);
                exit;
            }
        }

        if ($method === 'DELETE' && $param) {
            $stmt = $pdo->prepare("DELETE FROM beans WHERE name = :name");
            $stmt->execute([':name' => $param]);
            echo json_encode(["status" => "deleted", "name" => $param]);
            exit;
        }
    }

    // --- /chat (Gemini AI Interrogation) ---
    if ($resource === 'chat' && $method === 'POST') {
        $api_key = getenv('GEMINI_API_KEY') ?: ($config['gemini_api_key'] ?? null);

        if (!$api_key) {
            echo json_encode([
                "response" => "AI Logic Notice: GEMINI_API_KEY is not configured on Dreamhost. You can set it in /coffee/api/config.php or as a server environment variable."
            ]);
            exit;
        }

        $message = $body['message'] ?? '';
        $context = $body['context'] ?? null;
        $context_str = json_encode($context);

        // System prompt roles matching consensus_agent/coffee_backend/agent.py
        $is_inventory = (strpos($context_str, "Candy Hearts") !== false) && (strpos($context_str, "espresso") === false);

        if ($is_inventory) {
            $system_role = "ROLE: Inventory Intelligence.\nTONE: Technical, data-driven, executive summary style.\nINSTRUCTION: Analyze the inventory. Report stock levels, aging, and variety. Format: **Metric:** Value.";
        } else {
            $system_role = "ROLE: Extraction Technician.\nTONE: Precision-focused, objective.\nINSTRUCTION: Analyze parameters (Grind, Temp, Flow Rate). Flow Rate = Yield / Time. Output format: **Analysis:** [Observation] **Action:** [Adjustment].";
        }

        $system_prompt = $system_role . "\n\nDATA CONTEXT:\n" . json_encode($context, JSON_PRETTY_PRINT) . "\n\nQUERY: " . $message;

        $post_fields = [
            "contents" => [
                [
                    "parts" => [
                        ["text" => $system_prompt]
                    ]
                ]
            ]
        ];

        // Call Gemini REST API
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . $api_key;
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($post_fields));
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);

        $res = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($http_code === 200 && $res) {
            $gemini_resp = json_decode($res, true);
            $ai_text = $gemini_resp['candidates'][0]['content']['parts'][0]['text'] ?? "No text response received.";
            echo json_encode(["response" => $ai_text]);
        } else {
            echo json_encode(["response" => "AI Request failed (HTTP $http_code). Please check API key."]);
        }
        exit;
    }

    // Default fallback
    http_response_code(404);
    echo json_encode(["error" => "Endpoint not found: $resource", "path" => $path]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
