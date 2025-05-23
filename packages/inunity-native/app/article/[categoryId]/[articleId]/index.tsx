import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Platform,
  Button,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import {
  MessageEventType,
  ArticleDetailPageEventType,
  CommentPayload,
} from "message-type/message-type";
import { useMessageManager } from "@/lib/MessageManager";
import { NativeInput } from "@/components/NativeInput";
import NativeCheckBox from "@/components/NativeCheckBox";
import CustomWebView from "@/components/CustomWebView";
import { useWebViewWithId, webViewOrigin } from "@/components/useWebView";
import Entypo from "@expo/vector-icons/Entypo";

export default function Detail() {
  const { articleId, categoryId } = useLocalSearchParams<{
    articleId: string;
    categoryId: string;
  }>();

  const { webViewRef } = useWebViewWithId("ArticleDetail");
  const messageManager = useMessageManager(webViewRef!);

  const [comment, setComment] = useState<CommentPayload>({
    text: "",
    isAnonymous: true,
  });
  const inputRef = useRef<TextInput>(null);
  const write = useCallback(() => {
    messageManager.sendMessage({
      event: MessageEventType.Page,
      value: {
        event: ArticleDetailPageEventType.SubmitComment,
        value: comment,
      },
    });
  }, [webViewRef, comment, messageManager]);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      // keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <CustomWebView
          initialUrl={`${webViewOrigin}/article/${categoryId}/${articleId}`}
          id={"ArticleDetail"}
          pageEventHandler={(pageEvent) => {
            switch (pageEvent.event) {
              case ArticleDetailPageEventType.StartEditComment: {
                // 댓글 정보 보존
                setComment(pageEvent.value as CommentPayload);
                inputRef.current?.focus();
              }
            }
          }}
        />
      </View>
      <View style={[styles.commentInputContainer, styles.inputFlexBox]}>
        <View style={styles.anonymityWrapper}>
          <View style={styles.selectedStateWrapper}>
            <NativeCheckBox
              checked={comment.isAnonymous}
              setChecked={(checked) =>
                setComment((prev) => ({ ...prev, isAnonymous: checked }))
              }
            />
            <ThemedText style={[styles.anonymityText, styles.textTypo]}>
              익명
            </ThemedText>
          </View>
          {/* // Todo: 댓글 수정/작성 분기처리, 현재 수정중인 댓글 취소 기능 구현 */}
          <ThemedText
            onPress={write}
            style={[styles.submitText, styles.textTypo]}
          >
            작성
          </ThemedText>
        </View>
        {comment.commentId && (
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <ThemedText>댓글 수정중</ThemedText>
            <Entypo
              name="cross"
              size={24}
              color="black"
              onPress={() =>
                setComment((prev) => ({ ...prev, commentId: undefined }))
              }
            />
          </View>
        )}
        <NativeInput
          ref={inputRef}
          value={comment.text}
          setValue={(v) => setComment((prev) => ({ ...prev, text: v }))}
          placeholder="댓글을 입력해주세요."
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inputFlexBox: {
    alignSelf: "stretch",
    overflow: "hidden",
  },
  checkboxesFlexBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  textTypo: {
    textAlign: "left",
    fontFamily: "Inter-Medium",
    fontWeight: "500",
    fontSize: 12,
  },
  container: {
    borderRadius: 2,
    backgroundColor: "#65558f",
    width: 18,
    height: 18,
    zIndex: 0,
  },
  checkSmallIcon: {
    position: "absolute",
    marginTop: -12,
    marginLeft: -12,
    top: "50%",
    left: "50%",
    width: 24,
    height: 24,
    zIndex: 1,
  },
  stateLayer: {
    borderRadius: 100,
    flexDirection: "row",
  },
  anonymityText: {
    color: "#000",
  },
  selectedStateWrapper: {
    paddingTop: 8,
    paddingBottom: 5,
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  submitText: {
    color: "#007aff",
  },
  anonymityWrapper: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    overflow: "hidden",
    alignSelf: "stretch",
  },
  inputPlaceholderText: {
    color: "#494949",
    width: "100%",
  },
  inputFieldWrapper: {
    borderRadius: 50,
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    overflow: "hidden",
  },
  commentInputContainer: {
    backgroundColor: "#fff",
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 30,
    overflow: "hidden",
  },
});
