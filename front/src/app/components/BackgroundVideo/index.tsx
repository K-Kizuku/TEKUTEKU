// App.js
import React, { useState, useRef } from "react";
// Firebase v9 のモジュラーSDKを利用
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  collection,
  getDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  addDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import styles from "./video.module.css";

// Firebase の初期化（各自の設定情報に置き換えてください）
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// STUN サーバーなどの設定（必要に応じて変更）
const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

const BackgroundVideo = () => {
  // video要素へのref
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  // WebRTC 関連のref
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  // ボタンの有効/無効状態、ルーム情報、Join用ダイアログの表示状態などをstateで管理
  const [cameraDisabled, setCameraDisabled] = useState(false);
  const [createDisabled, setCreateDisabled] = useState(true);
  const [joinDisabled, setJoinDisabled] = useState(true);
  const [hangupDisabled, setHangupDisabled] = useState(true);
  const [currentRoom, setCurrentRoom] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [joinRoomIdInput, setJoinRoomIdInput] = useState("");

  // カメラ・マイクのストリーム取得
  const openUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      localStreamRef.current = stream;
      remoteStreamRef.current = new MediaStream();
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
      }
      setCameraDisabled(true);
      setJoinDisabled(false);
      setCreateDisabled(false);
      setHangupDisabled(false);
    } catch (error) {
      console.error("Error accessing user media:", error);
    }
  };

  // PeerConnection の状態変化イベントを登録
  const registerPeerConnectionListeners = (pc: RTCPeerConnection) => {
    pc.addEventListener("icegatheringstatechange", () => {
      console.log(`ICE gathering state changed: ${pc.iceGatheringState}`);
    });
    pc.addEventListener("connectionstatechange", () => {
      console.log(`Connection state change: ${pc.connectionState}`);
    });
    pc.addEventListener("signalingstatechange", () => {
      console.log(`Signaling state change: ${pc.signalingState}`);
    });
    pc.addEventListener("iceconnectionstatechange", () => {
      console.log(`ICE connection state change: ${pc.iceConnectionState}`);
    });
  };

  // ルーム作成（Caller 側）の処理
  const createRoom = async () => {
    setCreateDisabled(true);
    setJoinDisabled(true);

    // Firestore で新しいルームドキュメントを作成（自動生成された ID）
    const roomRef = doc(collection(db, "rooms"));
    console.log("Create PeerConnection with configuration: ", configuration);
    const pc = new RTCPeerConnection(configuration);
    peerConnectionRef.current = pc;
    registerPeerConnectionListeners(pc);

    // ローカルストリームの各トラックを PeerConnection に追加
    localStreamRef.current?.getTracks().forEach((track) => {
      if (localStreamRef.current) {
        pc.addTrack(track, localStreamRef.current);
      }
    });

    // --- ICE candidate の収集（Caller 側） ---
    const callerCandidatesCollection = collection(roomRef, "callerCandidates");
    pc.addEventListener("icecandidate", (event) => {
      if (!event.candidate) {
        console.log("Got final candidate!");
        return;
      }
      console.log("Got candidate: ", event.candidate);
      addDoc(callerCandidatesCollection, event.candidate.toJSON());
    });
    // --- ICE candidate の収集 終了 ---

    // --- ルーム作成：オファーの生成と Firestore への保存 ---
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    console.log("Created offer:", offer);
    const roomWithOffer = {
      offer: {
        type: offer.type,
        sdp: offer.sdp,
      },
    };
    await setDoc(roomRef, roomWithOffer);
    setRoomId(roomRef.id);
    console.log(`New room created with SDP offer. Room ID: ${roomRef.id}`);
    setCurrentRoom(`Current room is ${roomRef.id} - You are the caller!`);
    // --- オファーの生成 終了 ---

    // --- リモートの SDP アンサーの受信 ---
    onSnapshot(roomRef, async (snapshot) => {
      const data = snapshot.data();
      if (!pc.currentRemoteDescription && data && data.answer) {
        console.log("Got remote description: ", data.answer);
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        await pc.setRemoteDescription(rtcSessionDescription);
      }
    });
    // --- リモート SDP アンサーの受信 終了 ---

    // --- リモート ICE candidate の受信 ---
    const calleeCandidatesCollection = collection(roomRef, "calleeCandidates");
    onSnapshot(calleeCandidatesCollection, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
          await pc.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
    // --- リモート ICE candidate の受信 終了 ---

    // --- リモートトラック受信時の処理 ---
    pc.addEventListener("track", (event) => {
      console.log("Got remote track:", event.streams[0]);
      event.streams[0].getTracks().forEach((track) => {
        console.log("Add a track to the remoteStream:", track);
        remoteStreamRef.current?.addTrack(track);
      });
    });
    // --- リモートトラック受信 終了 ---
  };

  // ルーム参加処理（ダイアログを表示）
  const joinRoom = () => {
    setCreateDisabled(true);
    setJoinDisabled(true);
    setShowJoinDialog(true);
  };

  // ダイアログで入力したルームIDでルーム参加
  const confirmJoinRoom = async () => {
    setShowJoinDialog(false);
    setRoomId(joinRoomIdInput);
    setCurrentRoom(`Current room is ${joinRoomIdInput} - You are the callee!`);
    console.log("Joining room:", joinRoomIdInput);
    await joinRoomById(joinRoomIdInput);
  };

  // 指定したルーム ID でルームに参加（Callee 側）の処理
  const joinRoomById = async (roomIdValue: string) => {
    const roomRef = doc(db, "rooms", roomIdValue);
    const roomSnapshot = await getDoc(roomRef);
    console.log("Got room:", roomSnapshot.exists());
    if (roomSnapshot.exists()) {
      console.log("Create PeerConnection with configuration: ", configuration);
      const pc = new RTCPeerConnection(configuration);
      peerConnectionRef.current = pc;
      registerPeerConnectionListeners(pc);

      localStreamRef.current?.getTracks().forEach((track) => {
        if (localStreamRef.current) {
          pc.addTrack(track, localStreamRef.current);
        }
      });

      // --- ICE candidate の収集（Callee 側） ---
      const calleeCandidatesCollection = collection(
        roomRef,
        "calleeCandidates"
      );
      pc.addEventListener("icecandidate", (event) => {
        if (!event.candidate) {
          console.log("Got final candidate!");
          return;
        }
        console.log("Got candidate: ", event.candidate);
        addDoc(calleeCandidatesCollection, event.candidate.toJSON());
      });
      // --- ICE candidate の収集 終了 ---

      // --- リモートトラック受信 ---
      pc.addEventListener("track", (event) => {
        console.log("Got remote track:", event.streams[0]);
        event.streams[0].getTracks().forEach((track) => {
          console.log("Add a track to the remoteStream:", track);
          remoteStreamRef.current?.addTrack(track);
        });
      });
      // --- リモートトラック受信 終了 ---

      // --- SDP アンサーの生成 ---
      const offer = roomSnapshot.data().offer;
      console.log("Got offer:", offer);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      console.log("Created answer:", answer);
      await pc.setLocalDescription(answer);
      const roomWithAnswer = {
        answer: {
          type: answer.type,
          sdp: answer.sdp,
        },
      };
      await updateDoc(roomRef, roomWithAnswer);
      // --- SDP アンサー生成 終了 ---

      // --- リモート ICE candidate の受信（Caller 側） ---
      const callerCandidatesCollection = collection(
        roomRef,
        "callerCandidates"
      );
      onSnapshot(callerCandidatesCollection, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            const data = change.doc.data();
            console.log(
              `Got new remote ICE candidate: ${JSON.stringify(data)}`
            );
            await pc.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
      // --- リモート ICE candidate の受信 終了 ---
    }
  };

  // 通話終了処理
  const hangUp = async () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      (localVideoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
    }
    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    setCameraDisabled(false);
    setJoinDisabled(true);
    setCreateDisabled(true);
    setHangupDisabled(true);
    setCurrentRoom("");

    // ルームが存在する場合、Firebase のルーム情報を削除
    if (roomId) {
      const roomRef = doc(db, "rooms", roomId);
      const calleeCandidatesSnapshot = await getDocs(
        collection(roomRef, "calleeCandidates")
      );
      calleeCandidatesSnapshot.forEach(async (candidateDoc) => {
        await deleteDoc(candidateDoc.ref);
      });
      const callerCandidatesSnapshot = await getDocs(
        collection(roomRef, "callerCandidates")
      );
      callerCandidatesSnapshot.forEach(async (candidateDoc) => {
        await deleteDoc(candidateDoc.ref);
      });
      await deleteDoc(roomRef);
    }
    window.location.reload();
  };

  return (
    <div>
      <h1>Welcome to FirebaseRTC!</h1>
      <div id="buttons">
        <button onClick={openUserMedia} disabled={cameraDisabled}>
          Open camera &amp; microphone
        </button>
        <button onClick={createRoom} disabled={createDisabled}>
          Create room
        </button>
        <button onClick={joinRoom} disabled={joinDisabled}>
          Join room
        </button>
        <button onClick={hangUp} disabled={hangupDisabled}>
          Hangup
        </button>
      </div>
      <div>
        <span id="currentRoom">{currentRoom}</span>
      </div>
      <div id="videos">
        <video
          ref={localVideoRef}
          id="localVideo"
          muted
          autoPlay
          playsInline
        ></video>
        <video
          ref={remoteVideoRef}
          id="remoteVideo"
          autoPlay
          playsInline
        ></video>
      </div>
      {/* Join Room 用の簡易ダイアログ（モーダル風） */}
      {showJoinDialog && (
        <div
          id="room-dialog"
          style={{
            border: "1px solid #000",
            padding: "16px",
            marginTop: "16px",
            display: "inline-block",
          }}
        >
          <h2>Join room</h2>
          <div>
            <label htmlFor="room-id">Room ID: </label>
            <input
              type="text"
              id="room-id"
              value={joinRoomIdInput}
              onChange={(e) => setJoinRoomIdInput(e.target.value)}
            />
          </div>
          <div style={{ marginTop: "8px" }}>
            <button onClick={() => setShowJoinDialog(false)}>Cancel</button>
            <button onClick={confirmJoinRoom}>Join</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundVideo;
