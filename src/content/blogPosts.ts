export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  link: string;
  tags: string[];
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "tcpip-stack",
    title: "Building a Userspace TCP/IP Stack",
    date: "2026-6-10",
    link: "https://github.com/IanMacwan/bananatcp",
    tags: ["c", "networking", "tcp-ip"],
    content: `# Building a Userspace TCP/IP Stack
**Development log for building a TCP/IP stack in userspace using C and Linux networking.**
---
## Introduction
Modern operating systems hide most networking complexity behind the kernel. Applications call \`send()\` or \`recv()\` and packets magically appear on the wire.

I wanted to understand what actually happens between those calls and the network interface, so I started building a small userspace TCP/IP stack in C.

Instead of relying on the kernel networking stack, the program receives raw IP packets from a Linux TUN device and processes them manually layer by layer.

---
## Intercepting Packets with TUN
Linux provides a virtual network interface called a **TUN device**. It behaves like a normal network interface, except packets are delivered directly to a userspace program instead of the kernel stack.

When the interface receives packets, they appear as raw IP frames on a file descriptor. This allows the program to parse and process packets manually.

### Creating a TUN Interface
\`\`\`c
tun_fd = tun_create(dev_name, &cfg);
if (tun_fd < 0) {
  perror("tun error");
  return 1;
}

packet_t pkt;
tcp_init();

while (1) {
  ssize_t n = read(tun_fd, pkt.buffer, PACKET_MAX_SIZE);
  if (n <= 0) continue;

  packet_init(&pkt, n);
  ipv4_handle(&pkt); // send up one layer
}
\`\`\`

---
## Parsing IPv4 Packets
Once packets are read from the TUN interface, the first step is parsing the IPv4 header. The header contains metadata such as the protocol type, source address, and destination address.

### IPv4 Header Structure
\`\`\`c
typedef struct {
  uint8_t ver_ihl; // Version and header length
  uint8_t tos; // DSCP / ECN
  uint16_t total_length;
  uint16_t id;
  uint16_t flags_frag;
  uint8_t ttl;
  uint8_t protocol;
  uint16_t checksum;
  uint32_t src_ip;
  uint32_t dst_ip;
} __attribute__((packed)) ipv4_hdr_t;
\`\`\`

---
## Dispatching Protocols
After parsing the IPv4 header, the stack inspects the \`protocol\` field to determine which transport layer handler should process the payload.

Each protocol implementation lives in its own module. This keeps the stack modular and easy to extend.

### Transport Layer Switch
\`\`\`c
switch (hdr->protocol) {
  case 1:
    icmp_handle(pkt, hdr);
    break;
  case 6:
    tcp_handle(pkt, hdr);
    break;
  case 17:
    udp_handle(pkt, hdr);
    break;
  default:
    printf("unsupported protocol %u\n", hdr->protocol);
    break;
}
\`\`\`

---
## Implementing TCP and a State Machine
This is where things actually start to feel like real networking.

I kept this implementation intentionally minimal. No full RFC madness—just enough of the TCP state machine to establish a connection, pass some data, and close things cleanly.

### TCP Connection Structure
\`\`\`c
typedef struct {
    tcp_state_t state;
    uint32_t snd_nxt;
    uint32_t rcv_nxt;
    uint16_t src_port;
    uint16_t dst_port;
    uint32_t src_ip;
    uint32_t dst_ip;
} tcp_conn_t;
\`\`\`

The interesting part is \`tcp_handle()\`, which is basically one big state machine. Every incoming packet gets parsed, and then the stack decides what to do based on the current connection state.

### Three-Way Handshake
\`\`\`c
case TCP_LISTEN:
  if (tcp->flags & TCP_SYN) {
    conn.state = TCP_SYN_RECEIVED;
    conn.rcv_nxt = seq + 1;
    conn.snd_nxt = 1000; // hardcoded for now

    tcp->flags = TCP_SYN | TCP_ACK;
    tcp->ack = htonl(conn.rcv_nxt);
    tcp->seq = htonl(conn.snd_nxt);

    tcp_send(pkt, ip_hdr, tcp);
    conn.snd_nxt += 1;
  }
  break;
\`\`\`

Client sends a \`SYN\`, the stack replies with \`SYN+ACK\`, and the connection advances to the next state. The implementation is intentionally simple and easy to trace line by line.

---
## Data Transfer and Connection Teardown
Once the connection reaches \`TCP_ESTABLISHED\`, the logic becomes mostly bookkeeping.

When data arrives:
* Update \`rcv_nxt\`
* Send an ACK
* Continue waiting for more packets
### Established Connection Handling
\`\`\`c
case TCP_ESTABLISHED:
  if (packet_remaining(pkt) > 0) {
    printf("tcp: data received (%zu bytes)\n",
           packet_remaining(pkt));

    conn.rcv_nxt += packet_remaining(pkt);

    tcp->flags = TCP_ACK;
    tcp->ack = htonl(conn.rcv_nxt);
    tcp->seq = htonl(conn.snd_nxt);

    tcp_send(pkt, ip_hdr, tcp);
  }

// some code omitted here

case TCP_CLOSE_WAIT:
  tcp->flags = TCP_FIN | TCP_ACK;
  tcp->seq = htonl(conn.snd_nxt++);
  tcp_send(pkt, ip_hdr, tcp);
  conn.state = TCP_LAST_ACK;
  break;

case TCP_LAST_ACK:
  if (tcp->flags & TCP_ACK) {
    conn.state = TCP_IGNORE;
    printf("tcp: connection closed\n");
    conn.snd_nxt = 0;
    conn.rcv_nxt = 0;
  }
  break;
\`\`\`

Closing the connection follows the same idea. A \`FIN\` moves the connection through \`CLOSE_WAIT\` and \`LAST_ACK\` until all state is cleaned up.

What I like about this implementation is how straightforward it is. Sequence numbers, flags, and state transitions are visible in one place, making debugging far less mysterious.

On the send side, \`tcp_send()\` handles packet construction, checksums, and passing segments back down to the IP layer.

---
## Where Things Stand
At this point, the stack can:
- Parse IPv4 packets
- Handle ICMP echo replies
- Inspect UDP packets
- Implement a minimal TCP state machine
  - Connection establishment
  - Basic data transfer
  - Graceful connection teardown

The stack can pull raw packets directly from a TUN interface, parse IPv4 headers, and route them to protocol handlers without relying on the kernel networking stack.

The TCP implementation is still intentionally minimal. There are no retransmissions, buffering mechanisms, or extensive edge-case handlers. The goal so far has been understanding the core mechanics rather than building a production-ready implementation.

The biggest takeaway is that there is no real magic. Once you strip away the abstractions, TCP is fundamentally a collection of:
- State transitions
- Sequence numbers
- Flags
- Checksums
- Packet routing

Seeing these mechanisms implemented manually makes debugging and understanding network behavior significantly easier.

### Next Steps
To move beyond a proof of concept, the stack still needs:
* Retransmission support
* Packet buffering
* Timeout handling
* Better connection management
* Edge-case and RFC compliance improvements

The goal is to gradually evolve this from a learning project into something that more closely resembles a real networking stack.

Thanks for reading!
`,
  },
];

export default blogPosts;
